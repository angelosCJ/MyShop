import { StatusBar } from 'expo-status-bar';
import { StyleSheet,Animated, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {

const window = useWindowDimensions();
const [translation] = useState(new Animated.Value(window.width*-0.365));
const [shopAnimation] = useState(new Animated.Value(window.height*-0.05));
const [salesAnimation] = useState(new Animated.Value(0));
const [documentAnimation] = useState(new Animated.Value(0));
const [inventoryAnimation] = useState(new Animated.Value(0));
const [settingsAnimation] = useState(new Animated.Value(0));
const [shopOpacity] = useState(new Animated.Value(1));
const [salesOpacity] = useState(new Animated.Value(0));
const [documentOpacity] = useState(new Animated.Value(0));
const [inventoryOpacity] = useState(new Animated.Value(0));
const [settingsOpacity] = useState(new Animated.Value(0));
const [moveShop] = useState(new Animated.Value(0));
const [moveSales] = useState(new Animated.Value(window.width));
const [moveDocument] = useState(new Animated.Value(window.width));
const [moveInventory] = useState(new Animated.Value(window.width));
const [moveSettings] = useState(new Animated.Value(window.width));

const [productName,setProductName] = useState('');
const [quantity,setQuantity] = useState<any>(0);
const [price,setPrice] =  useState<any>(0);
const [finalPrice,setFinalPrice] =  useState<any>('');
const [totalAmount,setTotalAmount] =  useState<any>('');
const [amountPayed,setAmountPayed] =  useState<any>('');
const [change,setChange] = useState("");
const [component,setComponent] = useState<unknown[]>([]);
const [list,setList] = useState<unknown[]>([]);
const [day, setDay] = useState<number>(0);
const [totalSales,setTotalSales] = useState<number>(0);


const calculateFinalPrice = () => {
  const newAmount = quantity * price;
  setFinalPrice(newAmount.toString()); 
}

const grandTotal = () =>{
const newTotal = parseFloat(totalAmount) || 0; 
const newFinalPrice = parseFloat(finalPrice) || 0;
const finalTotal = newTotal + newFinalPrice;
  setTotalAmount(finalTotal.toString());
}

const addSale = async () => {
const parsedData = {
  date: new Date().toLocaleString('en-US', { 
    timeZone: 'Africa/Nairobi', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  }),
  name: productName,
  quantity: parseFloat(quantity),
  price: parseFloat(price),
  total: parseFloat(finalPrice)
};

setComponent([...component,{id:component.length,day,productName,quantity,price,finalPrice}]);

try {
  await axios.post("https://apisales-h8x7.onrender.com/insert", parsedData, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    },
    params: {
      _: new Date().getTime() // Unique timestamp to bypass cache
    }
  });

  console.log("Data sent and stored in database");

} catch (error) {
    console.log("Unable to send data", error);
}
};


const calculateChange = () => {
 
  
  const totalValue = parseFloat(totalAmount);
  const lastChange = amountPayed - totalValue;
  setChange(lastChange.toString());
};


const clearCounter = () =>{
  setComponent([]);
  setChange("");
  setTotalAmount(""); 
  setPrice("");
  setProductName("");
  setQuantity("");
  setFinalPrice(""); 
  setAmountPayed("");
}

const deleteFromDatabase = async (id: string) => {
  try {
    await axios.delete(`https://apisales-h8x7.onrender.com/delete/${id}`);
    console.log("Successfully deleted from database");
  } catch (error) {
    console.error("Error deleting from database:", error);
  }
};


const deleteComponent = async (indexToRemove: number) => {
  const itemToRemove = component[indexToRemove] as { id: string }; // Assuming `id` is a string
  
  if (itemToRemove?.id) {
    await deleteFromDatabase(itemToRemove.id);
  }
  
  setComponent(component.filter((_, index) => index !== indexToRemove));
};



const readData = async () =>{
try {
const response = await axios.get("https://apisales-h8x7.onrender.com/read");
response.data.forEach((item: any, index: number) => {
  console.log(`Item ${index}:`, item); // Log each item separately to inspect its structure
 fetchTotalSales();
});
console.log("Response Data: ", response.data);
setList(response.data);
} catch (error) {
console.log("Unable to fetch data",error);
}
}
 useEffect(() => {
   readData();
 }, []);


 const fetchTotalSales = async () => {
  try {
    const response = await axios.get("https://apisales-h8x7.onrender.com/sales/sum");
    setTotalSales(response.data.totalSales);
  } catch (error) {
    console.error("Error fetching total sales:", error);
  }
};


const openShop = () => {
  Animated.timing(translation, {
    toValue: window.width*-0.365,
    duration: 400,
    useNativeDriver: true,
  }).start();

  Animated.timing(shopAnimation,{toValue:window.height*-0.05,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();

  Animated.timing(shopOpacity,{toValue:1,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();

  Animated.timing(moveShop,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSales,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveDocument,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveInventory,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSettings,{toValue:window.width,duration:400,useNativeDriver:true}).start();

};
const openSales = () => {
  Animated.timing(translation, {
    toValue: window.width*-0.18,
    duration: 400,
    useNativeDriver: true,
  }).start();

  Animated.timing(shopAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesAnimation,{toValue:window.height*-0.05,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();

  Animated.timing(shopOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesOpacity,{toValue:1,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();

  Animated.timing(moveShop,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSales,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveDocument,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveInventory,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSettings,{toValue:window.width,duration:400,useNativeDriver:true}).start();

};
const openDocument = () => {
  Animated.timing(translation, {
    toValue: window.width*0,
    duration: 400,
    useNativeDriver: true,
  }).start();

  Animated.timing(shopAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentAnimation,{toValue:window.height*-0.05,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();

  Animated.timing(shopOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentOpacity,{toValue:1,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();

  Animated.timing(moveShop,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSales,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveDocument,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveInventory,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSettings,{toValue:window.width,duration:400,useNativeDriver:true}).start();

};
const openInventory = () => {
  Animated.timing(translation, {
    toValue: window.width*0.18,
    duration: 400,
    useNativeDriver: true,
  }).start();

  Animated.timing(shopAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryAnimation,{toValue:window.height*-0.05,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();

  Animated.timing(shopOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryOpacity,{toValue:1,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();

  Animated.timing(moveShop,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSales,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveDocument,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveInventory,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSettings,{toValue:window.width,duration:400,useNativeDriver:true}).start();

};
const openSettings = () => {
  Animated.timing(translation, {
    toValue: window.width*0.365,
    duration: 400,
    useNativeDriver: true,
  }).start();

  Animated.timing(shopAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryAnimation,{toValue:window.height*0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsAnimation,{toValue:window.height*-0.05,duration:400,useNativeDriver:true}).start();

  Animated.timing(shopOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(salesOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(documentOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(inventoryOpacity,{toValue:0,duration:400,useNativeDriver:true}).start();
  Animated.timing(settingsOpacity,{toValue:1,duration:400,useNativeDriver:true}).start();

  Animated.timing(moveShop,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSales,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveDocument,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveInventory,{toValue:window.width,duration:400,useNativeDriver:true}).start();
  Animated.timing(moveSettings,{toValue:0,duration:400,useNativeDriver:true}).start();

};

  return (
    <View style={[styles.container,{height:window.height,width:window.width}]}>
     <View style={[styles.menu,{height:window.height*0.15,width:window.width,top:window.height*0.85}]} >
       <Animated.View style={[styles.navFrame,{height:window.height*0.075,width:window.width*0.5,top:window.height*0, transform: [{ translateX: translation }]}]} >
         <View style={[styles.cover,{height:window.height*0.0375,width:window.width*0.4,top:window.height*0}]} ></View>
         <View style={[styles.ball,{height:window.height*0.075,width:window.width*0.16}]} ></View>
         <View style={[styles.ballLeft,{height:window.height*0.075,width:window.width*0.16,left:window.width*0.013}]} ></View>
         <View style={[styles.ballRight,{height:window.height*0.075,width:window.width*0.16,left:window.width*0.328}]} ></View>
       </Animated.View>
       <TouchableOpacity onPress={openShop} >
           <Animated.View style={{transform: [{ translateY: shopAnimation }]}} >
           <Ionicons name='storefront' size={35} color='rgb(253,254,255)' />
           </Animated.View>
         </TouchableOpacity>
         <TouchableOpacity onPress={openSales} >
           <Animated.View style={{transform: [{ translateY: salesAnimation }]}} >
           <Ionicons name='stats-chart' size={35} color='rgb(253,254,255)' />
           </Animated.View>
         </TouchableOpacity>
         <TouchableOpacity onPress={openDocument} >
           <Animated.View style={{transform: [{ translateY: documentAnimation }]}} >
           <Ionicons name='documents' size={35} color='rgb(253,254,255)' />
           </Animated.View>
         </TouchableOpacity>
         <TouchableOpacity onPress={openInventory} >
           <Animated.View style={{transform: [{ translateY: inventoryAnimation }]}} >
           <Ionicons name='create' size={35} color='rgb(253,254,255)' />
           </Animated.View>
         </TouchableOpacity>
         <TouchableOpacity onPress={openSettings} >
           <Animated.View style={{transform: [{ translateY: settingsAnimation }]}} >
           <Ionicons name='construct' size={35} color='rgb(253,254,255)' />
           </Animated.View>
         </TouchableOpacity>

        <Animated.View style={{opacity:shopOpacity,position:'absolute',left:window.width*0.08,top:window.height*0.07}} >
          <Text style={{color:'rgb(253,254,255)',fontSize:20,fontWeight:800}} >Home</Text>
        </Animated.View>
        <Animated.View style={{opacity:salesOpacity,position:'absolute',left:window.width*0.25,top:window.height*0.07}} >
          <Text style={{color:'rgb(253,254,255)',fontSize:20,fontWeight:800}} >Sales</Text>
        </Animated.View>
        <Animated.View style={{opacity:documentOpacity,position:'absolute',left:window.width*0.44,top:window.height*0.07}} >
          <Text style={{color:'rgb(253,254,255)',fontSize:20,fontWeight:800}} >Profit</Text>
        </Animated.View>
        <Animated.View style={{opacity:inventoryOpacity,position:'absolute',left:window.width*0.58,top:window.height*0.07}} >
          <Text style={{color:'rgb(253,254,255)',fontSize:20,fontWeight:800}} >Inventory</Text>
        </Animated.View>
        <Animated.View style={{opacity:settingsOpacity,position:'absolute',left:window.width*0.78,top:window.height*0.07}} >
          <Text style={{color:'rgb(253,254,255)',fontSize:20,fontWeight:800}} >Settings</Text>
        </Animated.View>
        
     </View>

     <Animated.View style={[styles.shopPanel,{height:window.height*0.83,width:window.width,transform: [{ translateX: moveShop }]}]} >
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.06}]} >
          <TextInput value={productName} onChangeText={(text)=>setProductName(text)} style={[styles.Input,{height:window.height*0.065,width:window.width*0.45}]} placeholder='Item Name' />
          <TextInput value={quantity.toString()} onChangeText={(text)=>setQuantity(Number(text))}  style={[styles.Input,{height:window.height*0.065,width:window.width*0.45}]} placeholder='Quantity' />
       </View>
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.16}]} >
          <TextInput value={price} onChangeText={(text)=>setPrice(Number(text))} style={[styles.Input,{height:window.height*0.065,width:window.width*0.45}]} placeholder='Price' />
          <View style={[styles.display,{height:window.height*0.065,width:window.width*0.45}]} >
          <Text style={{fontSize:25}} >F.Price: {finalPrice}</Text>
          </View> 
       </View>
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.26}]} >
          <TouchableOpacity onPress={calculateFinalPrice} >
            <View style={[styles.finalBtn,{height:window.height*0.065,width:window.width*0.45}]} ><Text style={{fontSize:25}} >CFP</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={grandTotal} >
            <View style={[styles.saleBtn,{height:window.height*0.065,width:window.width*0.45}]} ><Text style={{fontSize:25}} >CT</Text></View>
          </TouchableOpacity>
       </View>
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.36}]} >
          <View style={[styles.display,{height:window.height*0.065,width:window.width*0.45}]} >
          <Text style={{fontSize:25}} >Total:{totalAmount.toString()}</Text>
          </View>
          <TouchableOpacity onPress={addSale} >
            <View style={[styles.addBtn,{height:window.height*0.065,width:window.width*0.45}]} ><Text style={{fontSize:25}} >Add Sale</Text></View>
          </TouchableOpacity> 
       </View>
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.46}]} >
          <TextInput value={amountPayed} onChangeText={(text)=>setAmountPayed(Number(text))} style={[styles.Input,{height:window.height*0.065,width:window.width*0.45}]}  placeholder='Amount Payed'/>
          <View style={[styles.display,{height:window.height*0.065,width:window.width*0.45}]} >
          <Text style={{fontSize:25}} >Change:{change.toString()}</Text>
          </View> 
       </View>
       <View style={[styles.subPanel,{height:window.height*0.1,width:window.width,top:window.height*0.56}]} >
          <TouchableOpacity onPress={calculateChange} >
            <View style={[styles.finalBtn,{height:window.height*0.065,width:window.width*0.45}]} ><Text style={{fontSize:25}} >C.change</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearCounter} >
            <View style={[styles.saleBtn,{height:window.height*0.065,width:window.width*0.45}]} ><Text style={{fontSize:25}} >Clear</Text></View>
          </TouchableOpacity>
       </View>
       <View style={[styles.viewPanel,{height:window.height*0.17,width:window.width,top:window.height*0.66}]} >
          <ScrollView>
          {component.map((value:any,index:number)=>{
          return(
            <View key={value.id} style={[styles.compFrame]} >
              <View style={[styles.component,{height: window.height*0.04, width: window.width}]} >

              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.06}]} >
              <Text  style={{color:'rgb(43,43,43)',fontSize:25}} >{index +1+'.'}</Text>
              </View>  
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:'rgb(43,43,43)',fontSize:25}} >{value.productName}</Text>
              </View>
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.06}]} >
              <Text style={{color:'rgb(43,43,43)',fontSize:25}} >{value.quantity}</Text>
              </View>
              
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:'rgb(43,43,43)',fontSize:25}} >{value.price}</Text>
              </View>
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:'rgb(43,43,43)',fontSize:25}} >{value.finalPrice}</Text>
              </View>

              <TouchableOpacity onPress={() => deleteComponent(index)} >
              <Ionicons name="trash" color='rgb(43,43,43)' size={25} />
              </TouchableOpacity>

              </View>
            </View>
          )
         })}
          </ScrollView>
       </View>
     </Animated.View>
     
     <Animated.View style={[styles.salesPanel,{height:window.height*0.83,width:window.width,transform: [{ translateX: moveSales }]}]} >
     <View style={[styles.salesView,{height:window.height*0.7,width:window.width*0.99,top:window.height*0.06}]} >
     
     <TouchableOpacity  onPress={readData} >
      <Ionicons  name="refresh-circle" color='rgb(43,43,43)' size={40}  />
     </TouchableOpacity>

     <Text style={{position:"absolute",left:window.width*0.6,top:window.height*0.0,fontSize:25,color:'rgb(43,43,43)',fontWeight:700}}  >Sales: {totalSales}</Text>

        <View style={[styles.compFrame,{height:window.height*0.72,width:window.width*0.99}]}  >
        <ScrollView>
        {list.map((val: any, index: number) => {
        return (   
        <View key={index} style={[styles.mainComp,{height:window.height*0.05,width:window.width*0.9}]} >
        
        <View style={[styles.dataSubpanel,{height:window.height*0.03,width:window.width*0.38,overflow:"hidden",justifyContent:"center"}]} >
        <Text  style={{color:'rgb(43,241,83)',fontSize:18,left:6}} >{val.date}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.16}]} >
        <Text  style={{color:'rgb(43,43,43)',fontSize:18,left:5}} >{val.name}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.14}]} >
        <Text  style={{color:'rgb(165,121,253)',fontSize:18}} >{val.price}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.07}]} >
        <Text  style={{color:'rgb(43,43,43)',fontSize:18}} >{val.quantity}</Text>  
        </View>
      
        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.12}]} >
        <Text  style={{color:'rgb(43,43,43)',fontSize:18}} >{val.total}</Text>  
        </View>
      
        </View>
       );
      })}
      </ScrollView>   
      </View>
     </View>
     </Animated.View>

     <Animated.View style={[styles.profitPanel,{height:window.height*0.83,width:window.width,transform: [{ translateX: moveDocument }]}]} ></Animated.View>
     <Animated.View style={[styles.inventoryPanel,{height:window.height*0.83,width:window.width,transform: [{ translateX:moveInventory }]}]} ></Animated.View>
     <Animated.View style={[styles.settingsPanel,{height:window.height*0.83,width:window.width,transform: [{ translateX: moveSettings }]}]} ></Animated.View>

      <StatusBar style="auto" backgroundColor='white' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(253,254,255)',
    flexDirection:'column',
  },
  menu:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(43,43,43)',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
    gap:40
  },
  navFrame:{
    display:'flex',
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(43,43,43)',
  },
  ball:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(165,121,253)',
    borderRadius:100,
    borderWidth:6,
    borderColor:'rgb(253,254,255)',
    top:-10.5,
  },
  ballLeft:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(43,43,43)',
    borderRadius:100,
  },
  ballRight:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(43,43,43)',
    borderRadius:100,
  },
  cover:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(253,254,255)',
    borderRadius:100,
  },
  shopPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(253,254,255)',
  },
  salesPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(253,254,255)',
    flexDirection:'column',
  },
  profitPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'yellow',
  },
  inventoryPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'red',
  },
  settingsPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'blue',
  },
  subPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(43,43,43)',
    borderRadius:100,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:10,
  },
  Input:{
    backgroundColor:'rgb(253,254,255)',
    borderRadius:100,
    textAlign:'center',
    fontSize:25,
  },
  display:{
    backgroundColor:'rgb(253,254,255)',
    borderRadius:100,
    fontSize:25,
    justifyContent:'center',
    alignItems:'center',
  },
  finalBtn:{
    backgroundColor:'rgb(165,121,253)',
    borderRadius:100,
    fontSize:25,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:6,
    borderColor:'rgb(253,254,255)',
  },
  saleBtn:{
    backgroundColor:'rgb(43,241,83)',
    borderRadius:100,
    fontSize:25,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:6,
    borderColor:'rgb(253,254,255)',
  },
  addBtn:{
    backgroundColor:'rgb(253,254,255)',
    borderRadius:100,
    fontSize:25,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:6,
    borderColor:'rgb(43,241,83)',
  },
  viewPanel:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(253,254,255)',
    borderRadius:0,
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    gap:10,
  },
  compFrame:{
    display:"flex",
    position:"relative",
    flexDirection:"column",
    backgroundColor:"rgb(253,254,255)",
  },
  component:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:10,
  },
  subComp:{
    display:"flex",
    position:"relative",
    justifyContent:"center",
  },
  dataView:{
    display:'flex',
    position:'absolute',
    backgroundColor:'rgb(253,254,255)',
    flexDirection:'column',
  },
  salesView:{
    display:"flex",
    backgroundColor:'rgb(253,254,255)',
    flexDirection:"column",
  },
  
  mainComp:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    backgroundColor:'rgb(253,254,255)',
    gap:12,
    alignItems:"center",
  },
  dataSubpanel:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    backgroundColor:'rgb(253,254,255)',
    alignItems:"center",
  },
});
